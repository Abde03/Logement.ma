import { useTheme } from '../hooks/useTheme';

const ThemeDebugger = () => {
  const { theme, toggleTheme, isLight, isDark } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 text-sm">
      <h3 className="font-bold mb-2">Theme Debug:</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>Is light: {isLight ? 'Yes' : 'No'}</p>
      <p>Is dark: {isDark ? 'Yes' : 'No'}</p>
      <p>HTML classes: {document.documentElement.className}</p>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme (Debug)
      </button>
    </div>
  );
};

export default ThemeDebugger;