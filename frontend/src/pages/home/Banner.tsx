import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background to-secondary rounded-3xl p-8 md:p-12">
      <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-12 max-w-7xl mx-auto">
        <div className="md:w-1/2 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl animate-pulse" />
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80"
            alt="Books Banner"
            className="w-full h-[400px] object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="md:w-1/2 w-full space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">New Releases</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover Your Next
            <span className="text-primary block">Favorite Book</span>
          </h1>

          <p className="text-lg text-white leading-relaxed">
            Explore this week's latest and greatest releases in the literary
            world. From heart-pumping thrillers to captivating memoirs, find
            your perfect read.
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="rounded-full">
              Explore Collection
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
