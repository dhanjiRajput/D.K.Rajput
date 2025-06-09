### NPM commands
    - npm init -y
    - npx tsc --init
    - npm i ws @types/ws

## tsconfig File :-
    {
    "compilerOptions": 
        {
            "target": "ES2020",
            "module": "CommonJS",
            "rootDir": "./src",
            "outDir": "./dist",
            "strict": true,
            "esModuleInterop": true,
            "moduleResolution": "node",
            "skipLibCheck": true
        }
    }
