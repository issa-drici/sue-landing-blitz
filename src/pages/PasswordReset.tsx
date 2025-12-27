import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Schema de validation
const formSchema = z.object({
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
});

// Configuration API
const API_BASE_URL = "https://api.sue.alliance-tech.fr";

const PasswordReset = () => {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get("email");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    // Validation au montage
    useEffect(() => {
        if (!token || !email) {
            setIsError(true);
            setErrorMessage("Lien de réinitialisation invalide ou incomplet.");
        }
    }, [token, email]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!token || !email) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    token,
                    email,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                toast.success("Mot de passe réinitialisé avec succès !");

                // Redirection après quelques secondes
                setTimeout(() => {
                    // Si une page de login existe, rediriger vers elle
                    // Sinon, peut-être rediriger vers l'app store ou la home
                    navigate("/");
                }, 3000);
            } else {
                // Gestion des erreurs Laravel (422)
                if (data.errors) {
                    // On prend la première erreur disponible
                    const firstError = Object.values(data.errors).flat()[0] as string;
                    setErrorMessage(firstError || "Une erreur est survenue.");

                    if (data.errors.email) {
                        setErrorMessage("Ce lien de réinitialisation est invalide ou a expiré.");
                    }
                } else {
                    setErrorMessage(data.message || "Une erreur est survenue.");
                }
            }
        } catch (error) {
            setErrorMessage("Impossible de contacter le serveur. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-16 h-16 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                            Succès !
                        </h1>
                        <p className="text-muted-foreground">
                            Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter sur l'application avec vos nouveaux identifiants.
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className="w-full uppercase font-bold italic"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black italic uppercase text-primary tracking-tighter">
                        Sue
                    </h1>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Nouveau mot de passe
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Entrez votre nouveau mot de passe ci-dessous.
                    </p>
                </div>

                {isError ? (
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-3 text-destructive">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div className="text-sm font-medium">
                            {errorMessage || "Le lien de réinitialisation est invalide."}
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Min. 8 caractères"
                                                className="bg-zinc-900 border-zinc-800 focus:border-primary text-white placeholder:text-zinc-600"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Répétez le mot de passe"
                                                className="bg-zinc-900 border-zinc-800 focus:border-primary text-white placeholder:text-zinc-600"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {errorMessage && (
                                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                                    {errorMessage}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-black italic uppercase tracking-wider bg-primary text-black hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    "Réinitialiser"
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
