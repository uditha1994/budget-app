import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Header } from '../../src/components/layout/Header';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function PlannerScreen() {
    const { t } = useTranslation();

    return (
        <ScreenWrapper>
            <Header title={t('planner.title')} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <EmptyState
                    emoji="📋"
                    title={t('empty.budgets.title')}
                    subtitle={t('empty.budgets.subtitle')}
                    actionLabel={t('planner.createBudget')}
                    onAction={() => { }}
                />
            </View>
        </ScreenWrapper>
    );
}