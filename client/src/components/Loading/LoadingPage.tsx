"use client"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function LoadingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Badge variant="outline">
        <Spinner className="size-8" />
        Aguarde...
      </Badge>
    </div>
  )
}
