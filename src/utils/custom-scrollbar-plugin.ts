import { PluginAPI } from "tailwindcss/types/config"
import colors from "tailwindcss/colors";

export function CustomScrollbarPlugin({ addUtilities }: PluginAPI) {
    const newUtilities = {
        ".scrollbar-webkit": {
            "&::-webkit-scrollbar": {
                height: "8px",
                width: "8px"
            },
            "&::-webkit-scrollbar-thumb": {
                background: colors.zinc[700],
                borderRadius: "8px",
            },
        }
    }

    addUtilities(newUtilities)
}