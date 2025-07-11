# StockMCP

> **⚠️ IMPORTANT DISCLAIMER: This is an experimental project for educational and research purposes only. Investing in stocks and other financial instruments carries significant risk of loss. You could lose all or more than your initial investment. The creator of this project is not responsible for any financial losses, damages, or consequences that may result from using this software. Always consult with a qualified financial advisor before making investment decisions. Use this software at your own risk.**

## Table of Contents

- [What is StockMCP?](#what-is-stockmcp)
- [Risk Warning](#risk-warning)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)
- [Educational Resources](#educational-resources)
- [Final Disclaimer](#final-disclaimer)

## 🤖 What is StockMCP?

StockMCP is an open-source experiment that explores what happens when artificial intelligence is given the ability to trade stocks autonomously. This project implements a Model Context Protocol (MCP) server that integrates with the Alpaca trading API, allowing AI models to interact with real financial markets.

This is purely an **educational and research project** designed to:
- Explore AI decision-making in financial markets
- Test the capabilities and limitations of AI trading systems
- Provide a foundation for academic research into algorithmic trading
- Demonstrate the integration of AI with financial APIs

## 🚨 Risk Warning

**NEVER USE THIS WITH REAL MONEY UNLESS YOU FULLY UNDERSTAND THE RISKS**

- This software is experimental and may contain bugs
- AI trading decisions can be unpredictable and may result in significant losses
- Market conditions can change rapidly and unpredictably
- Past performance does not guarantee future results
- You are solely responsible for any trading decisions and their consequences

## 🏗️ Project Structure

This project uses:
- **TypeScript** for type-safe development
- **Model Context Protocol (MCP)** for AI integration
- **Alpaca Trade API** for stock market access
- **Docker** for containerized deployment

## 🛠️ Prerequisites

- Docker and Docker Compose
- Alpaca Trading Account (paper trading recommended)

## 🚀 Usage


This MCP server provides AI models with trading capabilities through the Alpaca API. The server implements various trading functions that can be called by compatible AI systems.

**STRONGLY RECOMMENDED**: Use only with Alpaca's paper trading environment.

1. Clone the repository:
```bash
git clone https://github.com/Ponesicek/StockMCP
cd StockMCP
```

2. Make an alpaca account at https://alpaca.markets/

3. Create a `.env` file with your Alpaca credentials:
```env
ALPACA_KEY=your_api_key_here
ALPACA_SECRET=your_secret_key_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets/v2  # Use paper trading URL
```

4. Build and run with Docker Compose:
```bash
npm run docker:dev
```

5. Configure your preferred MCP client (e.g., Claude, Gemini CLI, Cursor) to connect to the StockMCP server using the following setup:
```json
    "stock-mcp": {
    "command": "docker",
    "args": ["exec", "-i", "stock-mcp-server", "node", "dist/index.js"]
}
```

## 🤝 Contributing

This is an open-source project and contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source. Please check the LICENSE file for specific terms.

## 🔗 Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol/servers)
- [Alpaca Trade API](https://github.com/alpacahq/alpaca-trade-api-js)

## 📚 Educational Resources

- [Alpaca Trading Documentation](https://alpaca.markets/docs/)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Financial Market Basics](https://www.investopedia.com/)

## ⚖️ Final Disclaimer

This software is provided "as is" without warranty of any kind. The use of this software for trading purposes is entirely at your own risk. The developers and contributors to this project disclaim all liability for any losses, damages, or other consequences that may result from the use of this software.

**Trading stocks involves substantial risk and is not suitable for all investors. Only trade with money you can afford to lose completely.**
