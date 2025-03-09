import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DifficultyLevel, LeaderboardEntry } from '../types';
import { getLeaderboard } from '../services/api';

const LeaderboardContainer = styled.div`
    background: ${props => props.theme.colors.background.secondary};
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 360px;
    height: 100%;
    overflow-y: auto;
    margin-left: 20px;
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.4em;
    font-weight: 600;
`;

const DifficultySelector = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const DifficultyButton = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.primary};
    color: ${props => props.active ? '#fff' : props.theme.colors.text.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.theme.colors.primary};
        color: #fff;
    }
`;

const DifficultyInfo = styled.div`
    padding: 12px;
    background: ${props => props.theme.colors.background.primary};
    border-radius: 4px;
    font-size: 0.9em;
    color: ${props => props.theme.colors.text.secondary};
    text-align: center;
    width: 100%;

    strong {
        color: ${props => props.theme.colors.text.primary};
        margin: 0 4px;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    padding: 12px 8px;
    text-align: left;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.primary};
    font-weight: bold;
`;

const Td = styled.td`
    padding: 10px 8px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.secondary};
`;

const RankCell = styled(Td) <{ rank: number }>`
    font-weight: bold;
    color: ${props => {
        if (props.rank === 1) return '#FFD700';  // 金牌
        if (props.rank === 2) return '#C0C0C0';  // 银牌
        if (props.rank === 3) return '#CD7F32';  // 铜牌
        return props.theme.colors.text.secondary;
    }};
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 20px;
    color: ${props => props.theme.colors.text.secondary};
`;

const EmptyText = styled.div`
    text-align: center;
    padding: 20px;
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
`;

const DIFFICULTY_INFO = {
    beginner: {
        label: '初级',
        size: '9 × 9',
        mines: 10,
        description: '适合初学者，较少地雷，容易上手'
    },
    intermediate: {
        label: '中级',
        size: '16 × 16',
        mines: 40,
        description: '难度适中，需要一定策略'
    },
    expert: {
        label: '高级',
        size: '30 × 16',
        mines: 99,
        description: '挑战性强，需要细心和技巧'
    }
} as const;

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

interface LeaderboardProps {
    initialDifficulty?: DifficultyLevel;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
    initialDifficulty = 'beginner'
}) => {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await getLeaderboard(difficulty);
                setEntries(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [difficulty]);

    const currentInfo = DIFFICULTY_INFO[difficulty];

    return (
        <LeaderboardContainer>
            <Title>排行榜</Title>
            <DifficultySelector>
                <ButtonGroup>
                    <DifficultyButton
                        active={difficulty === 'beginner'}
                        onClick={() => setDifficulty('beginner')}
                    >
                        初级
                    </DifficultyButton>
                    <DifficultyButton
                        active={difficulty === 'intermediate'}
                        onClick={() => setDifficulty('intermediate')}
                    >
                        中级
                    </DifficultyButton>
                    <DifficultyButton
                        active={difficulty === 'expert'}
                        onClick={() => setDifficulty('expert')}
                    >
                        高级
                    </DifficultyButton>
                </ButtonGroup>
                <DifficultyInfo>
                    <div>
                        棋盘大小: <strong>{currentInfo.size}</strong> |
                        地雷数量: <strong>{currentInfo.mines}</strong>
                    </div>
                    <div>{currentInfo.description}</div>
                </DifficultyInfo>
            </DifficultySelector>

            {loading ? (
                <LoadingText>加载中...</LoadingText>
            ) : entries.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <Th style={{ width: '60px' }}>排名</Th>
                            <Th>玩家</Th>
                            <Th style={{ width: '80px' }}>用时</Th>
                            <Th style={{ width: '140px' }}>完成时间</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.rank}>
                                <RankCell rank={entry.rank}>{entry.rank}</RankCell>
                                <Td>{entry.user_name}</Td>
                                <Td>{formatTime(entry.best_time)}</Td>
                                <Td>{formatDate(entry.played_at)}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <EmptyText>暂无记录</EmptyText>
            )}
        </LeaderboardContainer>
    );
}; 