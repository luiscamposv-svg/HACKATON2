import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { fetchTeamMembers, fetchMemberTasks } from '../services/teamService';
import { Task, TeamMember } from '../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';

const TeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoadingMembers(true);
        const team = await fetchTeamMembers();
        setMembers(team);
        if (team.length) {
          setSelectedMember(team[0]);
        }
      } catch (error) {
        console.error('No se pudieron cargar los miembros del equipo', error);
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedMember) {
        setMemberTasks([]);
        return;
      }
      try {
        setLoadingTasks(true);
        const tasks = await fetchMemberTasks(selectedMember.id);
        setMemberTasks(tasks);
      } catch (error) {
        console.error('No se pudieron cargar las tareas del miembro', error);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [selectedMember]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Equipo</h1>
        <p className="text-sm text-slate-500">Consulta los miembros disponibles y sus responsabilidades.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Miembros del equipo" subtitle="Selecciona a alguien para ver sus tareas">
          {loadingMembers ? (
            <p className="text-sm text-slate-500">Cargando equipo...</p>
          ) : members.length ? (
            <ul className="space-y-3">
              {members.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      selectedMember?.id === member.id
                        ? 'border-brand-200 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-100'
                    }`}
                  >
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No hay miembros registrados todavía.</p>
          )}
        </Card>

        <Card
          className="lg:col-span-2"
          title={selectedMember ? `Tareas asignadas a ${selectedMember.name}` : 'Selecciona un miembro'}
          subtitle={selectedMember ? 'Filtrado automático desde la API' : undefined}
        >
          {loadingTasks ? (
            <p className="text-sm text-slate-500">Cargando tareas del miembro...</p>
          ) : selectedMember ? (
            memberTasks.length ? (
              <ul className="space-y-4">
                {memberTasks.map((task) => (
                  <li key={task.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-500">{task.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {STATUS_LABELS[task.status]}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <p>Prioridad: {PRIORITY_LABELS[task.priority]}</p>
                      {task.dueDate && <p>Vence: {new Date(task.dueDate).toLocaleDateString()}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No hay tareas asignadas para esta persona.</p>
            )
          ) : (
            <p className="text-sm text-slate-500">Selecciona un miembro para ver sus tareas.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TeamPage;
