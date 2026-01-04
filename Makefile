.PHONY: install build start develop dev

install:
npm install
cd frontend && npm install

build:
cd frontend && npm run build

start:
npx start-server -s ./frontend/dist

develop:
npx start-server -s ./frontend/dist

dev:
cd frontend && npm run dev
