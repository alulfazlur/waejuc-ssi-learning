"use client";
import { createContext, useContext } from "react";

// Lets the active step report its autosave status to the shell's top bar.
export const LessonShellContext = createContext({ setSaveStatus: () => {} });

export const useLessonShell = () => useContext(LessonShellContext);
