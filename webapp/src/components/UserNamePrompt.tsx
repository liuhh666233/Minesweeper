import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Dialog = styled.div`
    background: ${props => props.theme.colors.background.primary};
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 16px;
    text-align: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    margin-bottom: 16px;
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
    font-size: 1em;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
`;

const Button = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: ${props => props.theme.colors.primary};
    color: white;
    cursor: pointer;
    font-size: 1em;
    width: 100%;

    &:hover {
        background: ${props => props.theme.colors.primaryDark};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

interface UserNamePromptProps {
    onSubmit: (userName: string) => void;
}

export const UserNamePrompt: React.FC<UserNamePromptProps> = ({ onSubmit }) => {
    const [userName, setUserName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            onSubmit(userName.trim());
        }
    };

    return (
        <Overlay>
            <Dialog>
                <form onSubmit={handleSubmit}>
                    <Title>欢迎来到扫雷游戏！</Title>
                    <Input
                        type="text"
                        placeholder="请输入你的用户名"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoFocus
                    />
                    <Button type="submit" disabled={!userName.trim()}>
                        开始游戏
                    </Button>
                </form>
            </Dialog>
        </Overlay>
    );
}; 