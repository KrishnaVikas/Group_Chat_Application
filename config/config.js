const config = {
    app: {
      port: 3000
    },
    db: {
      name: 'groupChatApp',
      baseUrl: "0.0.0.0",
      port: "27017"
    },
    saltRounds: 10,
    JWT_SECRET: "e0e584dfe73dda6850719054ed51e2e92c07eaa5f494928b0fbcbf0d35527b02"
};

export default config;