import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";

describe("AppController", () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController]
        }).compile();
    });

    describe("root", () => {
        it("should return \"Google Analytics Report Service\"", () => {
            const controller = app.get(AppController);
            expect(controller.root()).toBe("Google Analytics Report Service");
        });
    });

});
