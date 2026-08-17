# Push all environment variables to the Vercel backend project
# Run from: SkillBridge\server directory

$envVars = @{
    "CLOUD_NAME"      = "dahnbpjad"
    "API_KEY"         = "575981964246317"
    "API_SECRET"      = "oiSZkalb7s7dfMDWLXjrrtEdsFc"
    "MONGODB_URL"     = "mongodb+srv://StudyNotion:vo4WltrLa3I51dZl@cluster0.jhrlfnp.mongodb.net/studynotiondb2"
    "PORT"            = "4000"
    "MAIL_HOST"       = "smtp.gmail.com"
    "MAIL_USER"       = "ankitsingh91040@gmail.com"
    "MAIL_PASS"       = "jden nusv mwnf chjb"
    "MAIL_PORT"       = "587"
    "JWT_SECRET"      = "manish"
    "FOLDER_NAME"     = "Edtech"
    "RAZORPAY_KEY"    = "rzp_test_RnEagYlvEQOGpy"
    "RAZORPAY_SECRET" = "TjShTMiIKh4GpuFfwW3IFgwP"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key ..." -ForegroundColor Cyan
    # Add to Production, Preview, and Development environments
    echo $value | vercel env add $key production --force
}

Write-Host "`n✅ All environment variables pushed to Vercel!" -ForegroundColor Green
Write-Host "Now run: vercel --prod" -ForegroundColor Yellow
