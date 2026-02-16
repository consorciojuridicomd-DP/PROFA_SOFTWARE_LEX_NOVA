import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! ADVERTENCIA !!
    // Esto permite que el build termine exitosamente a pesar de errores de tipo.
    // Solo se usa para pruebas rápidas según solicitud del usuario.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar errores de linting durante el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
