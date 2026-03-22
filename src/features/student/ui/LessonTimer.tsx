"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, LinearProgress, Alert, Paper } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TimerIcon from "@mui/icons-material/Timer";

interface LessonTimerProps {
  lessonId: number;
  timeLimitMinutes?: number | null;
  onTimeUp: () => void;
}

export function LessonTimer({
  lessonId,
  timeLimitMinutes,
  onTimeUp,
}: LessonTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const STORAGE_KEY = `lesson-timer-${lessonId}`;

  // Инициализация таймера
  useEffect(() => {
    if (!timeLimitMinutes || timeLimitMinutes <= 0 || isTimeUp) {
      return;
    }

    // Проверяем сохраненное состояние
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (savedState) {
      try {
        const { endTime, paused } = JSON.parse(savedState);
        const now = Date.now();

        if (paused) {
          setIsPaused(true);
          setRemainingSeconds(null);
        } else if (endTime > now) {
          const remaining = Math.floor((endTime - now) / 1000);
          setRemainingSeconds(remaining);

          if (remaining <= 0) {
            handleTimeUp();
          }
        } else {
          handleTimeUp();
        }
      } catch (e) {
        // Если сохраненные данные повреждены, начинаем заново
        startTimer();
      }
    } else {
      // Первый запуск таймера
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lessonId, timeLimitMinutes, isTimeUp]);

  // Запуск таймера
  const startTimer = useCallback(() => {
    if (!timeLimitMinutes || timeLimitMinutes <= 0) return;

    const totalSeconds = timeLimitMinutes * 60;
    const endTime = Date.now() + totalSeconds * 1000;

    // Сохраняем состояние
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        endTime,
        paused: false,
        startedAt: new Date().toISOString(),
      })
    );

    setRemainingSeconds(totalSeconds);
    setIsPaused(false);
  }, [timeLimitMinutes, STORAGE_KEY]);

  // Обновление таймера каждую секунду
  useEffect(() => {
    if (
      remainingSeconds === null ||
      remainingSeconds <= 0 ||
      isTimeUp ||
      isPaused
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }

        const newRemaining = prev - 1;

        // Обновляем сохраненное время
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                ...state,
                endTime: Date.now() + newRemaining * 1000,
              })
            );
          } catch (e) {
            // Игнорируем ошибки при обновлении сохраненного состояния
          }
        }

        return newRemaining;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [remainingSeconds, isTimeUp, isPaused, STORAGE_KEY]);

  // Обработка истечения времени
  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    clearInterval(timerRef.current!);

    // Очищаем сохраненное состояние
    localStorage.removeItem(STORAGE_KEY);

    // Вызываем колбэк для автоматической отправки
    onTimeUp();
  }, [onTimeUp, STORAGE_KEY]);

  // // Обработка паузы (при уходе со страницы)
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (
  //       document.visibilityState === "hidden" &&
  //       remainingSeconds &&
  //       remainingSeconds > 0 &&
  //       !isPaused
  //     ) {
  //       // Ставим на паузу при уходе со страницы
  //       setIsPaused(true);
  //       const savedState = localStorage.getItem(STORAGE_KEY);
  //       if (savedState) {
  //         try {
  //           const state = JSON.parse(savedState);
  //           localStorage.setItem(
  //             STORAGE_KEY,
  //             JSON.stringify({
  //               ...state,
  //               paused: true,
  //               pauseTime: Date.now(),
  //             })
  //           );
  //         } catch (e) {
  //           // Игнорируем ошибки
  //         }
  //       }
  //     } else if (document.visibilityState === "visible" && isPaused) {
  //       // Возобновляем при возврате на страницу
  //       const savedState = localStorage.getItem(STORAGE_KEY);
  //       if (savedState) {
  //         try {
  //           const state = JSON.parse(savedState);
  //           if (state.paused && state.endTime) {
  //             const remaining = Math.floor((state.endTime - Date.now()) / 1000);
  //             if (remaining > 0) {
  //               setRemainingSeconds(remaining);
  //               setIsPaused(false);
  //               localStorage.setItem(
  //                 STORAGE_KEY,
  //                 JSON.stringify({
  //                   ...state,
  //                   paused: false,
  //                 })
  //               );
  //             } else {
  //               handleTimeUp();
  //             }
  //           }
  //         } catch (e) {
  //           // Если данные повреждены, завершаем таймер
  //           handleTimeUp();
  //         }
  //       }
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [remainingSeconds, isPaused, handleTimeUp, STORAGE_KEY]);

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Если нет ограничения по времени
  if (!timeLimitMinutes || timeLimitMinutes <= 0) {
    return null;
  }

  // Если время истекло
  if (isTimeUp) {
    return (
      <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
        Время на выполнение урока истекло. Ваши ответы были отправлены
        автоматически.
      </Alert>
    );
  }

  // Если таймер на паузе
  if (isPaused) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Таймер приостановлен. Вернитесь на страницу урока, чтобы продолжить
        выполнение.
      </Alert>
    );
  }

  // Основной интерфейс таймера
  return (
    <Paper
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor:
          remainingSeconds && remainingSeconds < 60 ? "error.main" : "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <TimerIcon
          color={
            remainingSeconds && remainingSeconds < 60 ? "error" : "primary"
          }
        />
        <Typography
          variant="h6"
          color={
            remainingSeconds && remainingSeconds < 60
              ? "error.main"
              : "primary.main"
          }
        >
          Ограничение по времени
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              px: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Осталось:
            </Typography>
            <Typography
              variant="h5"
              fontWeight={600}
              color={
                remainingSeconds && remainingSeconds < 60
                  ? "error.main"
                  : "text.primary"
              }
            >
              {remainingSeconds !== null
                ? formatTime(remainingSeconds)
                : "--:--"}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={
              remainingSeconds !== null
                ? Math.max(
                    0,
                    ((timeLimitMinutes * 60 - remainingSeconds) /
                      (timeLimitMinutes * 60)) *
                      100
                  )
                : 0
            }
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  remainingSeconds && remainingSeconds < 60
                    ? "error.main"
                    : remainingSeconds && remainingSeconds < 180
                      ? "warning.main"
                      : "success.main",
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block", px: 1 }}
          >
            На выполнение урока отведено {timeLimitMinutes} минут. По истечении
            времени ваши ответы будут отправлены автоматически.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
