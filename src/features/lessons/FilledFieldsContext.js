"use client";
import { createContext, useContext } from "react";

// Set of field names whose current value passes the step's schema; provided by
// LessonController and read by QuestionCard for its "answered" badge.
export const FilledFieldsContext = createContext(null);

export const useFieldsFilled = (fields = []) => {
    const filled = useContext(FilledFieldsContext);
    if (!filled || fields.length === 0) return false;
    return fields.every((f) => filled.has(f));
};
