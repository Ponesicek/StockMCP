import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Alpaca from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_KEY!,
  secretKey: process.env.ALPACA_SECRET!,
  paper: true
});

// Create an MCP server
const server = new McpServer({
  name: "stock-server",
  version: "1.0.0"
});

server.registerTool("get-stock-price",
    {
      title: "Get Stock Price",
      description: "Get the current price of a stock",
      inputSchema: { symbol: z.string() }
    },
    async ({ symbol }) => {
        try {
            const snapshot = await alpaca.getSnapshot(symbol);
            const latestTrade = snapshot.LatestTrade;
            
            if (!latestTrade) {
                return {
                    content: [{ type: "text", text: `No trading data available for ${symbol}` }]
                };
            }
            
            return {
                content: [{ 
                    type: "text", 
                    text: `${symbol}: $${latestTrade.Price} (as of ${latestTrade.Timestamp})` 
                }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error fetching price for ${symbol}: ${(error as Error).message}` }]
            };
        }
    }
)

server.registerTool("get-account",
    {
        title: "Get Account",
        description: "Get the account information",
        inputSchema: { }
    },
    async () => {
        const account = await alpaca.getAccount();
        return { content: [{ type: "text", text: JSON.stringify(account) }] };
    }
)

server.registerTool("get-cash",
    {
        title: "Get Cash",
        description: "Get the cash information",
        inputSchema: { }
    },
    async () => {
        const cash = await alpaca.getAccount().then((account: any) => account.cash + " " + account.currency);
        return { content: [{ type: "text", text: JSON.stringify(cash) }] };
    }
)

server.registerTool("get-stock-asset-info",
    {
        title: "Get Stock Asset Info",
        description: "Retrieve detailed asset information about a stock",
        inputSchema: { symbol: z.string() }
    },
    async ({ symbol }) => {
        const asset = await alpaca.getAsset(symbol);
        return { content: [{ type: "text", text: JSON.stringify(asset) }] };
    }
)

server.registerTool("get-orders",
    {
        title: "Get Orders",
        description: "Get all orders (open, filled, canceled)",
        inputSchema: { }
    },
    async () => {
        const orders = await alpaca.getOrders({ 
            status: 'all', 
            limit: 10, 
            until: null, 
            after: null, 
            direction: null, 
            nested: null, 
            symbols: null 
        });
        if (orders.length === 0) {
            return { content: [{ type: "text", text: "No orders found" }] };
        }
        
        return { content: [{ type: "text", text: JSON.stringify(orders, null, 2) }] };
    }
)

server.registerTool("get-positions",
    {
        title: "Get Positions",
        description: "Get all current stock positions (long and short)",
        inputSchema: { }
    },
    async () => {
        const positions = await alpaca.getPositions();
        if (positions.length === 0) {
            return { content: [{ type: "text", text: "No current positions" }] };
        }
        
        const formatted = positions.map((pos: any) => ({
            symbol: pos.symbol,
            quantity: pos.qty,
            side: pos.side, // 'long' or 'short'
            market_value: pos.market_value,
            unrealized_pl: pos.unrealized_pl
        }));
        
        return { content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }] };
    }
)

server.registerTool("place-order",
    {
        title: "Make Order",
        description: "Make an order",
        inputSchema: { symbol: z.string(), quantity: z.number(), side: z.enum(['buy', 'sell']), time_in_force: z.enum(['day', 'gtc', 'opg', 'ioc']) }
    },
    async ({ symbol, quantity, side, time_in_force }) => {
        const order = await alpaca.createOrder({
            symbol: symbol,
            qty: quantity,
            side: side,
            type: 'market',
            time_in_force: time_in_force,
          });
        return { content: [{ type: "text", text: JSON.stringify(order) }] };
    }
)

server.registerTool("get-quote",
    {
        title: "Get Quote",
        description: "Get the quote for a stock",
        inputSchema: { symbol: z.string() }
    },
    async ({ symbol }) => {
        const quote = await alpaca.getLatestQuote(symbol);
        return { content: [{ type: "text", text: JSON.stringify(quote) }] };
    }
)

server.registerTool("cancel-order",
    {
        title: "Cancel Order",
        description: "Cancel an order",
        inputSchema: { order_id: z.string() }
    },
    async ({ order_id }) => {
        const order = await alpaca.cancelOrder(order_id);
        return { content: [{ type: "text", text: JSON.stringify(order) }] };
    }
)

server.registerTool("place-limit-order",
    {
        title: "Place Limit Order",
        description: "Place a limit order",
        inputSchema: { symbol: z.string(), quantity: z.number(), side: z.enum(['buy', 'sell']), price: z.number(), time_in_force: z.enum(['day', 'gtc', 'opg', 'ioc']) }
    },
    async ({ symbol, quantity, side, price, time_in_force }) => {
        const order = await alpaca.createOrder({
            symbol: symbol,
            qty: quantity,
            side: side,
            type: 'limit',
            limit_price: price,
            time_in_force: time_in_force,
        });
        return { content: [{ type: "text", text: JSON.stringify(order) }] };
    }
)

server.registerTool("get-portfolio-value",
    {
        title: "Get Portfolio Value",
        description: "Get the portfolio value",
        inputSchema: { }
    },
    async () => {
        const portfolio = await alpaca.getAccount().then((account: any) => account.portfolio_value);
        return { content: [{ type: "text", text: JSON.stringify(portfolio) }] };
    }
)

server.registerTool("get-market-status",
    {
        title: "Get Market Status",
        description: "Get the market status",
        inputSchema: { }
    },
    async () => {
        const marketStatus = await alpaca.getClock();
        return { content: [{ type: "text", text: JSON.stringify(marketStatus) }] };
    }
)

server.registerTool("get-historical-data",
    {
        title: "Get Historical Data",
        description: "Get historical price bars for a stock",
        inputSchema: { 
            symbol: z.string(),
            timeframe: z.enum(['1Min', '5Min', '15Min', '1Hour', '1Day']).default('1Day'),
            start: z.string().optional(),
            end: z.string().optional(),
            limit: z.number().default(100)
        }
    },
    async ({ symbol, timeframe, start, end, limit }) => {
        try {
            // Use getBarsV2 for historical data with date range
            const bars: any[] = [];
            const barsGenerator = alpaca.getBarsV2(symbol, {
                start: start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Default: 30 days ago
                end: end || new Date().toISOString(),
                timeframe: alpaca.newTimeframe(1, timeframe === '1Min' ? alpaca.timeframeUnit.MIN :
                                                 timeframe === '5Min' ? alpaca.timeframeUnit.MIN :
                                                 timeframe === '15Min' ? alpaca.timeframeUnit.MIN :
                                                 timeframe === '1Hour' ? alpaca.timeframeUnit.HOUR :
                                                 alpaca.timeframeUnit.DAY),
                limit: limit
            });
            
            for await (let bar of barsGenerator) {
                bars.push(bar);
            }
            
            if (bars.length === 0) {
                return { content: [{ type: "text", text: `No historical data found for ${symbol}` }] };
            }
            
            return { content: [{ type: "text", text: JSON.stringify(bars, null, 2) }] };
        } catch (error) {
            return { content: [{ type: "text", text: `Error fetching historical data: ${(error as Error).message}` }] };
        }
    }
)

server.registerTool("place-stop-order",
    {
        title: "Place Stop Order",
        description: "Place a stop order",
        inputSchema: { symbol: z.string(), quantity: z.number(), side: z.enum(['buy', 'sell']), price: z.number(), time_in_force: z.enum(['day', 'gtc', 'opg', 'ioc']) }
    },
    async ({ symbol, quantity, side, price, time_in_force }) => {
        const order = await alpaca.createOrder({
            symbol: symbol,
            qty: quantity,
            side: side,
            type: 'stop',
            stop_price: price,
            time_in_force: time_in_force,
        });
        return { content: [{ type: "text", text: JSON.stringify(order) }] };
    }
)

server.registerTool("place-stop-limit-order",
    {
        title: "Place Stop Limit Order",
        description: "Place a stop limit order",
        inputSchema: { symbol: z.string(), quantity: z.number(), side: z.enum(['buy', 'sell']), stop_price: z.number(), limit_price: z.number(), time_in_force: z.enum(['day', 'gtc', 'opg', 'ioc']) }
    },
    async ({ symbol, quantity, side, stop_price, limit_price, time_in_force }) => {
        const order = await alpaca.createOrder({
            symbol: symbol,
            qty: quantity,
            side: side,
            type: 'stop_limit',
            stop_price: stop_price,
            limit_price: limit_price,
            time_in_force: time_in_force,
        });
        return { content: [{ type: "text", text: JSON.stringify(order) }] };
    }
)


const transport = new StdioServerTransport();
await server.connect(transport);