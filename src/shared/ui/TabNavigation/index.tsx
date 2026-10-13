"use client";

import { Box, Tabs } from "@mui/material";
import { StyledTab } from "./style";

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  children,
}: TabNavigationProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2, flexShrink: 0 }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          sx={{
            mx: "28px",
          }}
        >
          {tabs.map((tab) => (
            <StyledTab
              key={tab.id}
              label={tab.label}
              value={tab.id}
              disableRipple
            />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
