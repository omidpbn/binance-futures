interface TabOption {
  label: string;
  value: string;
}

interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  btnClassName?: string;
  ActiveClassName?: string;
  NotActiveClassName?: string;
}
