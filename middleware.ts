import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
        '/',
        '/trips',
        '/communities',
        '/api/webhooks/clerk',
        '/api/uploadthing'
    ],
    ignoredRoutes: [
        '/api/webhooks/clerk',
        '/api/uploadthing'
    ]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};