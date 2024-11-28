pipeline {
    agent any
    
    environment {
        // You can specify global environment variables here, like NODE_ENV
        NODE_ENV='PRODUCTION'
        FRONTEND_URL='http://localhost:3001'

        DB_URI='mongodb+srv://donblezzy:Myschool12345@shopit.z1pjnwt.mongodb.net/ShopIT?retryWrites=true&w=majority&appName=ShopIT'

        JWT_SECRET ='S248ABCDEG1456'
        JWT_EXPIRES_TIME ='7d'
        COOKIE_EXPIRES_TIME='7'

        STRIPE_SECRET_KEY='sk_test_51PIUrk05HB41KwPhsBA5XI3doaXHZJozb5x1jZTvXCxUGc0NQofuva0TBabp6bmSQhij3DwPzEiW6eUrCRx2bcUd001gqXyewX'
        STRIPE_WEBHOOK_SECRET='whsec_2b7aec59c8b5571079f7d1fded23debb63948e1f101117a021790c402a84e6f6'

        SMTP_HOST='sandbox.smtp.mailtrap.io'
        SMTP_PORT ='2525'
        SMTP_EMAIL ='7a25927854a3c8'
        SMTP_PASSWORD ='a25adde97748fc'
        SMTP_FROM_EMAIL ='noreply@shopit.com'
        SMTP_FROM_NAME ='ShopIT'

        CLOUDINARY_CLOUD_NAME = 'df1zje8xy'
        CLOUDINARY_API_KEY = '343957393298166'
        CLOUDINARY_API_SECRET = 'aXnEUwHah5Yni-sgJhLW9Dj3d5M'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                git branch: 'jenkinsPractical', url: 'https://github.com/donblezzy/e-commerce.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies using npm
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests using npm (assuming you use a testing framework like Mocha or Jest)
                    sh 'npm test'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the Node.js application (if applicable, e.g., compiling assets)
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
        
    }
}
