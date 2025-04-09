# Compiler Design Project - Parser Visualizer & Automata Converter

A web-based tool for visualizing parsing processes and converting between different types of automata. This project includes an LL(1) Parser implementation, automata conversion utilities, and interactive visualizations.

## Features

- **Parser Visualizer**
  - Interactive interface for grammar input
  - Step-by-step visualization of parsing process
  - Support for LL(1) parsing
  - First and Follow set computation
  - Parsing table generation

- **Automata Converter**
  - Convert between different types of automata
  - Visual representation of automata
  - Step-by-step conversion process
  - Interactive state diagram visualization

- **User Interface**
  - Modern, responsive design
  - Dark/Light theme support
  - Interactive code editor
  - Real-time visualization updates

## Technology Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rutwik2003/Compiler-Visualizer-.git
   cd Compiler-Visualizer-
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
project/
├── src/
│   ├── components/         # React components
│   ├── parser/            # Parser implementation
│   │   ├── ll1Parser.ts   # LL(1) Parser logic
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── automataUtils.ts
│   │   └── ...
│   ├── App.tsx           # Main application component
│   └── index.css         # Global styles
├── public/               # Static assets
└── package.json         # Project dependencies
```

## Usage

1. **Parser Visualizer**
   - Enter your grammar in the input field
   - Click "Visualize" to see the parsing steps
   - View First/Follow sets and parsing table

2. **Automata Converter**
   - Input your automaton definition
   - Select conversion type
   - View the step-by-step conversion process

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Rutwik Butani** - *Initial work* - [Rutwik2003](https://github.com/Rutwik2003)

## Acknowledgments

- Dr. Urvisha Patel - Project Guide
- Amtics Institute

## Contact

Rutwik Butani - rutwikbutani@gmail.com

Project Link: [https://github.com/Rutwik2003/Compiler-Visualizer-](https://github.com/Rutwik2003/Compiler-Visualizer-)
