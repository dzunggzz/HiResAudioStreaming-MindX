// vite.config.ts
import { defineConfig } from "file:///C:/Users/lqd12/Downloads/HiResAudioStreaming-MindX-main%20(1)/HiResAudioStreaming-MindX-main/weq8-main/node_modules/vite/dist/node/index.js";
import typescript from "file:///C:/Users/lqd12/Downloads/HiResAudioStreaming-MindX-main%20(1)/HiResAudioStreaming-MindX-main/weq8-main/node_modules/@rollup/plugin-typescript/dist/es/index.js";
import path from "path";
import { typescriptPaths } from "file:///C:/Users/lqd12/Downloads/HiResAudioStreaming-MindX-main%20(1)/HiResAudioStreaming-MindX-main/weq8-main/node_modules/rollup-plugin-typescript-paths/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\lqd12\\Downloads\\HiResAudioStreaming-MindX-main (1)\\HiResAudioStreaming-MindX-main\\weq8-main";
var vite_config_default = defineConfig({
  plugins: [],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__vite_injected_original_dirname, "./src")
      }
    ]
  },
  server: {
    port: 3e3
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      name: "weq8",
      entry: "src/main.ts",
      fileName: "[name]",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      input: {
        runtime: "src/runtime.ts",
        ui: "src/ui/index.ts"
      },
      output: {
        inlineDynamicImports: false
      },
      plugins: [
        typescriptPaths({
          preserveExtensions: true
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist"
        })
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxscWQxMlxcXFxEb3dubG9hZHNcXFxcSGlSZXNBdWRpb1N0cmVhbWluZy1NaW5kWC1tYWluICgxKVxcXFxIaVJlc0F1ZGlvU3RyZWFtaW5nLU1pbmRYLW1haW5cXFxcd2VxOC1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxscWQxMlxcXFxEb3dubG9hZHNcXFxcSGlSZXNBdWRpb1N0cmVhbWluZy1NaW5kWC1tYWluICgxKVxcXFxIaVJlc0F1ZGlvU3RyZWFtaW5nLU1pbmRYLW1haW5cXFxcd2VxOC1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9scWQxMi9Eb3dubG9hZHMvSGlSZXNBdWRpb1N0cmVhbWluZy1NaW5kWC1tYWluJTIwKDEpL0hpUmVzQXVkaW9TdHJlYW1pbmctTWluZFgtbWFpbi93ZXE4LW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG5pbXBvcnQgdHlwZXNjcmlwdCBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tdHlwZXNjcmlwdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHR5cGVzY3JpcHRQYXRocyB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXR5cGVzY3JpcHQtcGF0aHNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJ+XCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICBidWlsZDoge1xuICAgIG1hbmlmZXN0OiB0cnVlLFxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIG5hbWU6IFwid2VxOFwiLFxuICAgICAgZW50cnk6IFwic3JjL21haW4udHNcIixcbiAgICAgIGZpbGVOYW1lOiBcIltuYW1lXVwiLFxuICAgICAgZm9ybWF0czogW1wiZXNcIiwgXCJjanNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAvLyBleHRlcm5hbDogL15saXQvLFxuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgcnVudGltZTogXCJzcmMvcnVudGltZS50c1wiLFxuICAgICAgICB1aTogXCJzcmMvdWkvaW5kZXgudHNcIixcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdHlwZXNjcmlwdFBhdGhzKHtcbiAgICAgICAgICBwcmVzZXJ2ZUV4dGVuc2lvbnM6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICB0eXBlc2NyaXB0KHtcbiAgICAgICAgICBzb3VyY2VNYXA6IGZhbHNlLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiB0cnVlLFxuICAgICAgICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThlLFNBQVMsb0JBQW9CO0FBRTNnQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFKaEMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDO0FBQUEsRUFDVixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixzQkFBc0I7QUFBQSxJQUN0QixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsSUFDdkI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUViLE9BQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULElBQUk7QUFBQSxNQUNOO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixzQkFBc0I7QUFBQSxNQUN4QjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsVUFDZCxvQkFBb0I7QUFBQSxRQUN0QixDQUFDO0FBQUEsUUFDRCxXQUFXO0FBQUEsVUFDVCxXQUFXO0FBQUEsVUFDWCxhQUFhO0FBQUEsVUFDYixRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
