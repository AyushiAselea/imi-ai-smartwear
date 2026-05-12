import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiRequest from "@/lib/api";

const OrderEnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    glasses: "Mark 1",
    paymentPreference: "Online",
    heardAbout: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        product: `IMI Glasses ${formData.glasses}`,
        glasses: formData.glasses,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: formData.paymentPreference,
        heardAbout: formData.heardAbout,
      };

      await apiRequest("/enquiries", {
        method: "POST",
        body: submissionData,
      });

      toast.success("Enquiry submitted successfully! We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        glasses: "Mark 1",
        paymentPreference: "Online",
        heardAbout: "",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit enquiry. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Interested in <span className="text-primary">Hey IMI</span>?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your interest and we'll get in touch with you soon to discuss your requirements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-foreground mb-2">
                  Your Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Glasses selection and Date row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="glasses" className="text-sm font-medium text-foreground mb-2">
                  Which Glasses? *
                </label>
                <select
                  id="glasses"
                  name="glasses"
                  value={formData.glasses}
                  onChange={handleInputChange}
                  className="rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Mark 1">Mark 1</option>
                  <option value="Mark 2">Mark 2</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-medium text-foreground mb-2">
                  Enquiry Date
                </label>
                <Input
                  id="date"
                  type="text"
                  value={new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  disabled
                  className="rounded-xl border-border bg-muted text-foreground cursor-not-allowed"
                />
              </div>
            </div>

            {/* Payment preference row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="paymentPreference" className="text-sm font-medium text-foreground mb-2">
                  Payment Preference *
                </label>
                <select
                  id="paymentPreference"
                  name="paymentPreference"
                  value={formData.paymentPreference}
                  onChange={handleInputChange}
                  className="rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Online">Online Payment</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="PARTIAL">Partial Payment</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="heardAbout" className="text-sm font-medium text-foreground mb-2">
                  How did you hear about us? (Optional)
                </label>
                <Input
                  id="heardAbout"
                  name="heardAbout"
                  type="text"
                  placeholder="e.g., Instagram, Friend, News, etc."
                  value={formData.heardAbout}
                  onChange={handleInputChange}
                  className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderEnquiryForm;
