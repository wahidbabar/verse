import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const news = [
  {
    id: 1,
    title: "Global Climate Summit Calls for Urgent Action",
    description:
      "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
    image:
      "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?auto=format&fit=crop&q=80",
    category: "Environment",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Breakthrough in AI Technology Announced",
    description:
      "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
    category: "Technology",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "New Space Mission Aims to Explore Distant Galaxies",
    description:
      "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80",
    category: "Science",
    date: "2024-03-13",
  },
  {
    id: 4,
    title: "Stock Markets Reach Record Highs",
    description:
      "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80",
    category: "Finance",
    date: "2024-03-12",
  },
  {
    id: 5,
    title: "Innovative New Smartphone Released",
    description:
      "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80",
    category: "Technology",
    date: "2024-03-11",
  },
];

const News = () => {
  return (
    <div className="py-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Stay updated with the latest literary world news
          </p>
        </div>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        navigation={true}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Navigation, Pagination]}
        className="!pb-12"
      >
        {news.map((item) => (
          <SwiperSlide key={item.id}>
            <Card className="h-full">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <Link to={`/news/${item.id}`}>
                  <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/news/${item.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default News;
