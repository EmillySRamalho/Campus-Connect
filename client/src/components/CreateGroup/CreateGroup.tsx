import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogType, IStudent } from "@/types";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowBigRight } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { FormSearch } from "./FormSearch/FormSearch";
import { CreateNewGroup } from "@/api/groups";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ICreateGroupProps {
  type?: DialogType;
}

export const CreateGroup = ({ type }: ICreateGroupProps) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  // mantém os alunos selecionados
  const [selectedStudents, setSelectedStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuthContext();

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const members = selectedStudents.map((s: IStudent) => s.id);

      const data = await CreateNewGroup(name, value, members, token);

      console.log(data);
      setName("");
      setValue("");
      setSelectedStudents([]);
      toast.success("Turma criada com sucesso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Dados da turma</TabsTrigger>
          <TabsTrigger value="participants">Participantes</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Dados da turma</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label>Título*</Label>
                <Input
                  placeholder="Nome da turma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label>Descrição*</Label>
                <Textarea
                  placeholder="Descrição da turma"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <span className="flex justify-evenly w-full text-gray-400">
                Adicionar participantes ao lado <ArrowBigRight />
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Participantes</CardTitle>
            </CardHeader>

            <CardContent>
              <FormSearch
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
              />
            </CardContent>

            <CardFooter>
              <Button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                type="submit"
                onClick={() => handleCreateGroup()}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center items-center gap-1.5">
                    <Spinner />
                    <span>Criando</span>
                  </span>
                ) : (
                  <span>Criar</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
