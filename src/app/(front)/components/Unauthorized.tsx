"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

export const Unauthorized = () => {
  return (
    <main className="h-dvh w-screen flex justify-center items-center bg-gradient-to-r from-red-500 to-yellow-500 p-10">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader className="pb-4 pt-2 px-4 text-center">
          <h1 className="text-3xl font-semibold text-gray-700">
            Acesso Negado
          </h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <Button
            color="danger"
            size="lg"
            onPress={() => {
              redirect("/signin");
            }}
          >
            Fazer Login
          </Button>
        </CardBody>
      </Card>
    </main>
  );
};
