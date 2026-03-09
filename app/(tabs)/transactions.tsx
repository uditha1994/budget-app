import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Header } from '../../src/components/layout/Header';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function TransactionsScreen() {
    const { t } = useTranslation();

    return (
        <ScreenWrapper>
            <Header title={t('transactions.title')} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <EmptyState
                    emoji="💳"
                    title={t('empty.transactions.title')}
                    subtitle={t('empty.transactions.subtitle')}
                    actionLabel={t('transactions.addExpense')}
                    onAction={() => { }}
                />
            </View>
        </ScreenWrapper>
    );
}