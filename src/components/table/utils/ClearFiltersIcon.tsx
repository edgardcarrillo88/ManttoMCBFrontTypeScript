import React from "react";
import { IconSvgProps } from "./types";

export const ClearFiltersIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    {/* Círculo */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* "X" */}
    <path
      d="M8 8L16 16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M16 8L8 16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
