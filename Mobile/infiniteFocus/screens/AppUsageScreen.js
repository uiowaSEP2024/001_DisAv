import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AppUsageModule from 'react-native-app-usage-module';

const AppUsageScreen = () => {
    const [usageStats, setUsageStats] = useState(null);

    useEffect(() => {
        // Fetch app usage stats when the component mounts
        fetchAppUsageStats().then(r =>null );
    }, []);

    const fetchAppUsageStats = async () => {
        try {
            // Replace 'com.example.app' with the package name of the app you want to monitor
            const packageName = 'com.example.app';
            const stats = await AppUsageModule.getUsageStats(packageName);
            setUsageStats(stats);
        } catch (error) {
            console.error('Error fetching app usage stats:', error);
        }
    };

    return (
        <View>
            <Text>App Usage Screen</Text>
            {usageStats ? (
                <View>
                    <Text>App Package Name: {usageStats.packageName}</Text>
                    <Text>Total Time in Foreground: {usageStats.totalTimeInForeground} seconds</Text>
                    {/* Add more usage information as needed */}
                </View>
            ) : (
                <Text>Loading app usage stats...</Text>
            )}
            <Button title="Refresh Stats" onPress={fetchAppUsageStats} />
        </View>
    );
};

export default AppUsageScreen;
