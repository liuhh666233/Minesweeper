import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserStats as UserStatsType, DifficultyStats } from '../types';
import { getUserStats } from '../services/api';

const StatsContainer = styled.div`
    background: ${props => props.theme.colors.background.secondary};
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 20px;
    text-align: center;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;

const DifficultyCard = styled.div`
    background: ${props => props.theme.colors.background.primary};
    border-radius: 8px;
    padding: 15px;
`;

const DifficultyTitle = styled.h3`
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 15px;
    text-align: center;
`;

const StatItem = styled.div`
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.colors.text.secondary};
`;

const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '暂无记录';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateWinRate = (stats: DifficultyStats): string => {
    if (stats.games === 0) return '0%';
    return `${((stats.wins / stats.games) * 100).toFixed(1)}%`;
};

interface UserStatsProps {
    userName: string;
}

export const UserStats: React.FC<UserStatsProps> = ({ userName }) => {
    const [stats, setStats] = useState<UserStatsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getUserStats(userName);
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userName]);

    if (loading) {
        return <StatsContainer>加载中...</StatsContainer>;
    }

    if (!stats) {
        return <StatsContainer>无法加载统计信息</StatsContainer>;
    }

    const difficulties = [
        { key: 'beginner', title: '初级' },
        { key: 'intermediate', title: '中级' },
        { key: 'expert', title: '高级' }
    ] as const;

    return (
        <StatsContainer>
            <Title>{stats.user_name} 的游戏统计</Title>
            <StatsGrid>
                {difficulties.map(({ key, title }) => (
                    <DifficultyCard key={key}>
                        <DifficultyTitle>{title}</DifficultyTitle>
                        <StatItem>
                            <span>总场次：</span>
                            <span>{stats.stats[key].games}</span>
                        </StatItem>
                        <StatItem>
                            <span>胜利：</span>
                            <span>{stats.stats[key].wins}</span>
                        </StatItem>
                        <StatItem>
                            <span>胜率：</span>
                            <span>{calculateWinRate(stats.stats[key])}</span>
                        </StatItem>
                        <StatItem>
                            <span>最佳时间：</span>
                            <span>{formatTime(stats.stats[key].best_time)}</span>
                        </StatItem>
                    </DifficultyCard>
                ))}
            </StatsGrid>
        </StatsContainer>
    );
}; 