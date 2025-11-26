import * as React from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

export function useLoadingState(initialState: boolean = false): LoadingState {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingText, setLoadingText] = React.useState<string>();

  const startLoading = React.useCallback((text?: string) => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    setLoadingText(undefined);
  }, []);

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
  };
}

export default useLoadingState;