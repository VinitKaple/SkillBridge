import React from "react";
import { featuresData } from "../assets/featuresData";
import {
  LayoutDashboard,
  Users,
  Brain,
  Package,
  Mail,
  ShieldCheck
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Users,
  Brain,
  Package,
  Mail,
  ShieldCheck
};

const Features = () => {
  return (
    <section id="features" className="py-10 mb-6 mt-10 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl font-bold text-center mb-6">
          Explore Our AI-Powered Banking Cross Sell Platform
        </h2>

    

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {featuresData.map((feature, index) => {
            const Icon = iconMap[feature.iconName];

            return (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-md 
                           hover:shadow-xl hover:-translate-y-1 
                           transition-all duration-300 
                           flex flex-col items-start space-y-4"
              >
                {Icon && (
                  <Icon className="h-10 w-10 text-blue-600" />
                )}

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
