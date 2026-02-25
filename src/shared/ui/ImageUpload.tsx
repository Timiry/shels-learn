"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

interface ImageUploadProps {
  onChange?: (file: File | null) => void;
  value?: File | string | null;
  disabled?: boolean;
  width: string;
  height: string;

  isCover?: boolean;
}

export default function ImageUpload({
  onChange,
  value,
  disabled = false,
  width,
  height,
  isCover,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Обновляем предварительный просмотр при изменении значения
  useEffect(() => {
    if (!value) {
      setImagePreview(null);
      return;
    }

    // Если value - строка (URL), используем её напрямую
    if (typeof value === "string") {
      setImagePreview(value);
      return;
    }

    // Если value - File, создаём объектный URL
    const url = URL.createObjectURL(value);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setIsLoading(true);
        // Имитируем загрузку для лучшего UX
        setTimeout(() => {
          if (onChange) onChange(file);
          setIsLoading(false);
        }, 300);
      } else {
        alert("Пожалуйста, выберите изображение");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setIsLoading(true);
        // Имитируем загрузку для лучшего UX
        setTimeout(() => {
          if (onChange) onChange(file);
          setIsLoading(false);
        }, 300);
      } else {
        alert("Пожалуйста, выберите изображение");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <Box
      width={width}
      height={height}
      sx={{
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        borderRadius: 1,
        p: 2,
        textAlign: "center",
        cursor: disabled ? "default" : "pointer",
        bgcolor: "background.paper",
        transition: "border-color 0.2s",
        "&:hover": {
          borderColor: disabled ? "divider" : "primary.main",
        },
        position: "relative",
        overflow: "hidden",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={() =>
        !disabled && document.getElementById("file-input")?.click()
      }
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Скрытое поле выбора файла */}
      <input
        type="file"
        id="file-input"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {/* Состояние загрузки */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Skeleton variant="circular" width={120} height={120} />
        </Box>
      )}

      {/* Если изображение выбрано */}
      {value && !isLoading && (
        <Box sx={{ position: "relative", width: "80%", mb: 2 }}>
          {/* Круглое изображение */}
          <Box
            sx={{
              borderRadius: isCover ? "3px" : "50%",
              overflow: "hidden",
              width: "100%",
              paddingTop: "100%",
              position: "relative",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Skeleton
                variant="circular"
                width="100%"
                height="100%"
                sx={{ position: "absolute" }}
              />
            )}
          </Box>

          {/* Название файла и подсказка */}
          <Box sx={{ mt: 1, textAlign: "center" }}>
            {value && typeof value !== "string" && (
              <Typography variant="body1" component="div">
                {value.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Нажмите для замены
            </Typography>
          </Box>
        </Box>
      )}

      {/* Если изображение не выбрано */}
      {!value && !isLoading && (
        <>
          {/* Иконка камеры */}
          <Box sx={{ mb: 1 }}>
            <PhotoCameraRoundedIcon
              sx={{
                fontSize: 100,
                color: "text.secondary",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  color: "primary.main",
                },
              }}
            />
          </Box>

          {/* Текст "Файл не выбран" */}
          <Typography variant="body1" component="div" sx={{ mb: 0.5 }}>
            Файл не выбран
          </Typography>

          {/* Подсказка */}
          <Typography variant="caption" color="text.secondary">
            Нажмите для выбора изображения или перетащите его в этот блок
          </Typography>
        </>
      )}

      {/* Визуальная подсказка при перетаскивании */}
      {isDragging && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "primary.main",
            opacity: 0.1,
            pointerEvents: "none",
            border: "2px dashed",
            borderColor: "primary.main",
          }}
        />
      )}
    </Box>
  );
}
