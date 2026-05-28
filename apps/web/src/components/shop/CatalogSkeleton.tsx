import { motion } from 'framer-motion';

interface CatalogSkeletonProps {
  count?: number;
}

export default function CatalogSkeleton({ count = 8 }: CatalogSkeletonProps) {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
        >
          {/* Image skeleton */}
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-gray-100">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Subcategory & Rating row */}
          <div className="mb-2 flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-4 w-10 rounded-full bg-amber-50" />
          </div>

          {/* Title skeleton */}
          <div className="mb-2 h-4 w-full rounded bg-gray-200" />
          <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />

          {/* Pricing skeleton */}
          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex flex-col gap-1">
              <div className="h-2 w-12 rounded bg-gray-200" />
              <div className="h-5 w-20 rounded bg-gray-200" />
            </div>
            <div className="h-9 w-9 rounded-full bg-gray-200" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
