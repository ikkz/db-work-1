let prefix = 'https://egg.ketra.top/';
if (document.location.href.indexOf('localhost') >= 0) {
  prefix = 'http://localhost:8080/';
}

export interface Student {
  No: string,
  Name: string,
  Sex: string,
  Age: number,
  Dept: string,
  Logn: string,
  Pswd: string,
}

export const allocStudent = () => ({
  No: "",
  Name: "",
  Sex: "",
  Age: 0,
  Dept: "",
  Logn: "",
  Pswd: "",
} as Student);

export interface Course {
  No: string,
  Name: string,
  Credit: number,
  Dept: string,
  Tname: string,
}

export const allocCourse = () => ({
  No: "",
  Name: "",
  Credit: 0,
  Dept: "",
  Tname: "",
}) as Course;

export enum ResturnCode {
  Ok,
  AuthError,
  ParamError,
  DatabaseError,
}

export interface Result<T> {
  code: ResturnCode,
  msg: string,
  data: T
}

const request = async (url: string, init?: RequestInit): Promise<any> => {
  let response = await fetch(url, {
    ...init,
    mode: 'cors'
  });
  if (response.ok) {
    let data = await response.json();
    console.log(data);
    return data;
  }
}

const getHeader = () => {
  return {
    'Username': localStorage.getItem('username') as string,
    'Password': localStorage.getItem('password') as string
  }
}

export const login = async (param: {
  username: string,
  password: string
}) => {
  return await request(prefix + 'api/status', {
    method: 'get',
    headers: param
  });
}

export const createStudent = async (student: Student) => {
  return await request(prefix + 'api/create-student', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify(student)
  }) as Result<Student>;
}

export const updateStudent = async (student: Student) => {
  return await request(prefix + 'api/update-student', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify(student)
  }) as Result<Student>;
}

export const getStduents = async () => {
  return await request(prefix + 'api/students', {
    method: 'get',
    headers: getHeader()
  }) as Result<Student[]>;
}

export const createCourse = async (course: Course) => {
  return await request(prefix + 'api/create-course', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify(course)
  }) as Result<Course>;
}

export const updateCourse = async (course: Course) => {
  return await request(prefix + 'api/update-course', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify(course)
  }) as Result<Course>;
}

export const getCourses = async () => {
  return await request(prefix + 'api/courses', {
    method: 'get',
    headers: getHeader()
  }) as Result<Course[]>;
}

export const getUserInfo = async () => {
  return await request(prefix + 'api/user-info', {
    method: 'get',
    headers: getHeader()
  }) as Result<Student>;
}

export interface CoursesDetail {
  Selected: Course[],
  Selectable: Course[],
  Unback: Course[],
}

export const allocCoursesDetail = () => ({
  Selected: [],
  Selectable: [],
  Unback: [],
} as CoursesDetail);

export const getCoursesDetail = async () => {
  return await request(prefix + 'api/course-detail', {
    method: 'get',
    headers: getHeader()
  }) as Result<CoursesDetail>;
}

export const selectCourse = async (cno: string) => {
  return await request(prefix + 'api/select-course', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify({
      CNo: cno
    })
  }) as Result<any>;
}

export const backCourse = async (cno: string) => {
  return await request(prefix + 'api/back-course', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify({
      CNo: cno
    })
  }) as Result<any>;
}

export interface LogItem {
  ID: number,
  CreatedAt: string,
  No: string,
  Actor: string,
  Action: string
}

export const getLogs = async (sno?: string) => {
  return await request(prefix + 'api/logs', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify({
      SNo: sno || ""
    })
  }) as Result<LogItem[]>;
}

export interface SC {
  CNo: string,
  SNo: string,
  Grade: number
}

export const getScs = async (cno: string) => {
  return await request(prefix + 'api/scs', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify({
      CNo: cno
    })
  }) as Result<SC[]>;
}

export const updateGrade = async (sc: SC) => {
  return await request(prefix + 'api/update-grade', {
    method: 'post',
    headers: getHeader(),
    body: JSON.stringify(sc)
  }) as Result<any>;
}

export interface AvgGrade {
  No: string,
  Name: string,
  Grade: number
}

export const gradeDis = async () => {
  return await request(prefix + 'api/dis', {
    method: 'get',
    headers: getHeader(),
  }) as Result<AvgGrade[]>;
}

export interface GradeItem {
  No: string,
  Name: string,
  Grade: number,
  Credit: number,
  Tname: string,
}

export const gradeReport = async () => {
  return await request(prefix + 'api/report', {
    method: 'get',
    headers: getHeader(),
  }) as Result<GradeItem[]>;
}