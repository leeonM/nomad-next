import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
        '/',
        '/trips',
        '/communities',
        '/api/webhook/clerk',
        '/api/uploadthing',
        '/community',
    ],
    ignoredRoutes: [
        '/api/webhook/clerk',
        '/api/uploadthing',
    ]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};