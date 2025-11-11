# CarePath Backend - TypeScript Migration

This backend has been successfully migrated from JavaScript to TypeScript.

## 🎯 Migration Details

### Changes Made:

- ✅ Converted all `.js` files to `.ts` with proper TypeScript types
- ✅ Added TypeScript interfaces for all Mongoose models
- ✅ Configured `tsconfig.json` with ESNext and NodeNext module resolution
- ✅ Updated build and development scripts
- ✅ Added type declarations for environment variables
- ✅ Integrated `@dotenvx/dotenvx` for environment variable management
- ✅ Set up `tsx` for development with watch mode

## 📦 Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Mongoose** - MongoDB ODM with TypeScript types
- **tsx** - TypeScript execution with hot reload
- **@dotenvx/dotenvx** - Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB instance
- `.env` file with required environment variables

### Environment Variables

Create a `.env` file in the backend root directory:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/carepath
FRONTEND_URL=http://localhost:5173
```

### Installation

```bash
# Install dependencies
npm install
```

## 🛠️ Available Scripts

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

This command uses `tsx --watch` to automatically restart the server when you make changes to TypeScript files.

### Type Checking

Check for TypeScript errors without building:

```bash
npm run typecheck
```

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

The compiled files will be output to the `dist/` directory.

### Start Production Server

Run the compiled production build:

```bash
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/           # Mongoose models with TypeScript interfaces
│   │   ├── User.ts
│   │   ├── Patient.ts
│   │   ├── Clinician.ts
│   │   ├── Alert.ts
│   │   ├── Task.ts
│   │   ├── Medication.ts
│   │   ├── SymptomCheckIn.ts
│   │   ├── Message.ts
│   │   ├── VideoCall.ts
│   │   ├── CarePathway.ts
│   │   ├── Exercise.ts
│   │   ├── Article.ts
│   │   ├── Assignment.ts
│   │   ├── Note.ts
│   │   ├── ReadHistory.ts
│   │   └── index.ts
│   ├── utils/
│   │   └── db.ts         # Database connection
│   ├── types/
│   │   └── environment.d.ts  # Environment variable types
│   ├── controllers/      # Route controllers (empty - ready for implementation)
│   ├── middlewares/      # Express middlewares (empty - ready for implementation)
│   ├── routers/          # API routes (empty - ready for implementation)
│   ├── app.ts            # Express app configuration
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript output (generated)
├── .env                  # Environment variables (not in git)
├── .gitignore
├── package.json
└── tsconfig.json         # TypeScript configuration
```

## 🔧 TypeScript Configuration

The project uses the following TypeScript configuration:

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "NodeNext",
		"moduleResolution": "NodeNext",
		"outDir": "./dist",
		"rootDir": "src",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true
	}
}
```

## 📝 Type Safety Features

All models now include TypeScript interfaces for better type safety:

- `IUser` - User model interface
- `IPatient` - Patient model interface
- `IClinician` - Clinician model interface
- `IAlert` - Alert model interface
- `ITask` - Task model interface
- `IMedication` - Medication model interface
- `ISymptomCheckIn` - Symptom check-in interface
- `IMessage` - Message model interface
- `IVideoCall` - Video call model interface
- `ICarePathway` - Care pathway model interface
- `IExercise` - Exercise model interface
- `IArticle` - Article model interface
- `IAssignment` - Assignment model interface
- `INote` - Note model interface
- `IReadHistory` - Read history model interface

## 🧪 Development Tips

1. **Hot Reload**: Use `npm run dev` during development for automatic reloading
2. **Type Checking**: Run `npm run typecheck` before committing to catch type errors
3. **Building**: Always run `npm run build` before deploying to ensure no compilation errors
4. **Environment Variables**: Use `@dotenvx/dotenvx` for secure environment variable management

## 🔐 Security Notes

- Never commit `.env` files to version control
- The `.env` file is already added to `.gitignore`
- Use `@dotenvx/dotenvx` for production deployments

## 📚 Next Steps

The following directories are ready for implementation:

- `/src/controllers` - Add your route controllers here
- `/src/middlewares` - Add authentication, validation, error handling here
- `/src/routers` - Add your API routes here

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
rm -rf dist node_modules
npm install
npm run build
```

### Development Server Issues

If the dev server doesn't start:

1. Check that `.env` file exists and has valid values
2. Verify MongoDB connection string
3. Ensure no other process is using the specified PORT

## 📄 License

[Add your license information here]
