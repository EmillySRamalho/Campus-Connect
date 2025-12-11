"use client";

import { SearchStudents } from "@/api/groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import { IStudent } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

interface IFormSearchProp {
  selectedStudents: IStudent[];
  setSelectedStudents: Dispatch<SetStateAction<IStudent[]>>;
}

export const FormSearch = ({
  selectedStudents,
  setSelectedStudents,
}: IFormSearchProp) => {
  const [value, setValue] = useState<string>("");
  const [student, setStudent] = useState<IStudent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuthContext();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await SearchStudents(token, value);
      console.log(data);
      setStudent(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(selectedStudents)
  }, [])

  return (
    <div>
      <div className="flex justify-between">
        <Input
          placeholder="Pesquisar por username ou e-mail"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant={"outline"} onClick={() => handleSearch()}>
          Buscar
        </Button>
      </div>
      <div className="h-50 overflow-y-auto">
        {loading ? (
          <span className="h-full w-full flex justify-center items-center gap-1.5">
            <Spinner className="size-5 text-blue-500" />
            <span>Buscando...</span>
          </span>
        ) : (
          student?.map((s, index) => (
            <div
              key={`${s.id}_${index}`}
              className="mt-4 flex flex-col gap-1.5"
            >
              <div className="border flex flex-col p-1.5 rounded-[5px] w-full">
                <span>
                  <strong>Nome:</strong> {s.name}
                </span>
                <span>
                  <strong>E-mail:</strong> {s.email}
                </span>
                {/* <span>
                  <strong>Curso:</strong> {s.course}
                </span> */}
                <Button
                  onClick={() => {
                    setSelectedStudents((prev) =>
                      prev.find((p) => p.id === s.id)
                        ? prev 
                        : [...prev, s]
                    );
                    toast.success(`Estudante, ${s.name} - ${s.id}, adicionado a fila.`)
                    }
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
