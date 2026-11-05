package com.teves.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping(path={"/teves/students", "/students"})
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody(required = false) Student student,
                                           @RequestParam(required = false) String firstname,
                                           @RequestParam(required = false) String lastname,
                                           @RequestParam(required = false) String course,
                                           @RequestParam(required = false) String section) throws URISyntaxException {
        if (student == null) {
            student = new Student();
        }
        if (student.getFirstname() == null && firstname != null) student.setFirstname(firstname.trim());
        if (student.getLastname() == null && lastname != null) student.setLastname(lastname.trim());
        if (student.getCourse() == null && course != null) student.setCourse(course.trim());
        if (student.getSection() == null && section != null) student.setSection(section.trim());

        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.created(new URI("/students/" + savedStudent.getId())).body(savedStudent);
    }

    @GetMapping
    public @ResponseBody Iterable<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public @ResponseBody ResponseEntity<?> getStudentById(@PathVariable Integer id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        }
        return ResponseEntity.status(404).body("Student with id " + id + " not found");
    }

    @PutMapping("/{id}")
    public @ResponseBody ResponseEntity<?> updateStudent(@PathVariable Integer id,
                                                         @RequestBody(required = false) Student updated,
                                                         @RequestParam(required = false) String firstname,
                                                         @RequestParam(required = false) String lastname,
                                                         @RequestParam(required = false) String course,
                                                         @RequestParam(required = false) String section) {
        Optional<Student> existingOpt = studentRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Student with id " + id + " not found.");
        }

        Student existing = existingOpt.get();
        if (updated != null && updated.getFirstname() != null) existing.setFirstname(updated.getFirstname().trim());
        else if (firstname != null) existing.setFirstname(firstname.trim());

        if (updated != null && updated.getLastname() != null) existing.setLastname(updated.getLastname().trim());
        else if (lastname != null) existing.setLastname(lastname.trim());

        if (updated != null && updated.getCourse() != null) existing.setCourse(updated.getCourse().trim());
        else if (course != null) existing.setCourse(course.trim());

        if (updated != null && updated.getSection() != null) existing.setSection(updated.getSection().trim());
        else if (section != null) existing.setSection(section.trim());

        Student saved = studentRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public @ResponseBody ResponseEntity<String> deleteStudent(@PathVariable Integer id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Student with id " + id + " not found.");
        }
        studentRepository.deleteById(id);
        return ResponseEntity.ok("Student with id " + id + " deleted.");
    }
}
