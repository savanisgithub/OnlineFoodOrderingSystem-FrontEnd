import { ImageIcon } from "lucide-react";
import { getBackendImageUrl } from "../../utils/imageUrl";

interface FoodImageProps {
    imageUrl?: string;
    alt: string;
    className?: string;
    iconSize?: number;
}

function FoodImage({ imageUrl, alt, className = "", iconSize = 28 }: FoodImageProps) {
    return (
        <div
            className={`overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 ${className}`}
        >
            {imageUrl ? (
                <img
                    src={getBackendImageUrl(imageUrl)}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="grid h-full w-full place-items-center text-orange-500">
                    <ImageIcon size={iconSize} />
                </div>
            )}
        </div>
    );
}

export default FoodImage;
