import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag, TrendingUp } from "lucide-react";

const CategoriesOverview = ({ categories }) => {
  console.log(categories);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Categories Overview
        </CardTitle>
        <CardDescription>
          Browse articles by category and see article distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
              onClick={() => setSelectedCategory(cat.category)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg capitalize text-blue-700">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cat.count} {cat.count === 1 ? "article" : "articles"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {cat.count}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesOverview;
