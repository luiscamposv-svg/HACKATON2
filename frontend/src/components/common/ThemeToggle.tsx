import { useTheme } from '../../hooks/useTheme';
import Button from './Button';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleTheme}
      className="text-xs font-semibold text-slate-600 dark:text-slate-200"
    >
      {isDarkMode ? 'Modo claro' : 'Modo oscuro'}
    </Button>
  );
};

export default ThemeToggle;
