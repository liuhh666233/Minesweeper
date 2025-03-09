export interface Theme {
    name: string;
    colors: {
        primary: string;
        background: string;
        text: string;
        border: string;
        cell: {
            revealed: string;
            unrevealed: string;
            hover: string;
        };
        button: {
            background: string;
            text: string;
            hover: string;
        };
        info: {
            background: string;
            text: string;
            highlight: string;
        };
    };
}

export const lightTheme: Theme = {
    name: 'light',
    colors: {
        primary: '#4a90e2',
        background: '#ffffff',
        text: '#333333',
        border: '#999999',
        cell: {
            revealed: '#e0e0e0',
            unrevealed: '#ffffff',
            hover: '#f0f0f0'
        },
        button: {
            background: '#ffffff',
            text: '#4a90e2',
            hover: '#4a90e2'
        },
        info: {
            background: '#f5f5f5',
            text: '#666666',
            highlight: '#4a90e2'
        }
    }
};

export const darkTheme: Theme = {
    name: 'dark',
    colors: {
        primary: '#61dafb',
        background: '#282c34',
        text: '#ffffff',
        border: '#666666',
        cell: {
            revealed: '#3a3f4b',
            unrevealed: '#282c34',
            hover: '#363b45'
        },
        button: {
            background: '#282c34',
            text: '#61dafb',
            hover: '#61dafb'
        },
        info: {
            background: '#363b45',
            text: '#e0e0e0',
            highlight: '#61dafb'
        }
    }
}; 