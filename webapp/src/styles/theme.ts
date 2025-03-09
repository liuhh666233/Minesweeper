import { createGlobalStyle } from 'styled-components';

export interface Theme {
    name: 'light' | 'dark';
    colors: {
        primary: string;
        primaryDark: string;
        background: {
            primary: string;
            secondary: string;
        };
        text: {
            primary: string;
            secondary: string;
        };
        border: string;
        cell: {
            revealed: string;
            unrevealed: string;
            hover: string;
        };
    };
}

export const theme: Theme = {
    name: 'light',
    colors: {
        primary: '#2196F3',
        primaryDark: '#1976D2',
        background: {
            primary: '#ffffff',
            secondary: '#f5f5f5'
        },
        text: {
            primary: '#333333',
            secondary: '#666666'
        },
        border: '#e0e0e0',
        cell: {
            revealed: '#e0e0e0',
            unrevealed: '#ffffff',
            hover: '#f0f0f0'
        }
    }
};

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: ${props => props.theme.colors.background.primary};
        color: ${props => props.theme.colors.text.primary};
    }

    button {
        font-family: inherit;
    }
`; 