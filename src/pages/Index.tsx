import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Users, Shield } from "lucide-react";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <img
        src={heroImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      
      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Messenger Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Messenger
            </span>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="gradient-primary shadow-glow"
          >
            Get Started
          </Button>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-20 animate-slide-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              Connect in Real-Time
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience modern messaging with stunning 3D design, real-time updates, and secure conversations.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="gradient-primary shadow-glow text-lg px-8 py-6"
            >
              Start Chatting Now
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              {
                icon: MessageCircle,
                title: "Instant Messages",
                description: "Send and receive messages in real-time with zero delay",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built with modern tech for blazing fast performance",
              },
              {
                icon: Users,
                title: "Connect Anyone",
                description: "Start conversations with anyone on the platform",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your conversations are protected with top-tier security",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-effect rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
