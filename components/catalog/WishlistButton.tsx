"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/lib/actions/wishlist";

export function WishlistButton({
  productId,
  initialWishlisted = false,
  className,
}: {
  productId: string;
  initialWishlisted?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (!result.ok) {
        if (result.requiresAuth) {
          router.push("/login");
          return;
        }
        toast.error(result.message ?? "Could not update wishlist");
        return;
      }
      setWishlisted(result.wishlisted ?? false);
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      disabled={isPending}
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("bg-background/80 backdrop-blur", className)}
    >
      <Heart className={cn("size-4", wishlisted && "fill-destructive text-destructive")} />
    </Button>
  );
}
