package com.teves.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*") // Allows React frontend from any origin (e.g. localhost:5173)
@Controller
@RequestMapping(path="/teves")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping(path="/add")
    public @ResponseBody ResponseEntity<?> addNewUser(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false) String email,
                                                       @RequestBody(required = false) User userBody) {
        String finalName = (userBody != null && userBody.getName() != null) ? userBody.getName() : name;
        String finalEmail = (userBody != null && userBody.getEmail() != null) ? userBody.getEmail() : email;

        if (finalName == null || finalName.trim().isEmpty() || finalEmail == null || finalEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name and email are required");
        }

        User n = new User();
        n.setName(finalName.trim());
        n.setEmail(finalEmail.trim());
        User savedUser = userRepository.save(n);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping(path="/{id}")
    public @ResponseBody ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(path={"/{id}", "/update/{id}"})
    public @ResponseBody ResponseEntity<?> updateUser(@PathVariable Integer id,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam(required = false) String email,
                                                      @RequestBody(required = false) User userBody) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = optionalUser.get();
        String updatedName = (userBody != null && userBody.getName() != null) ? userBody.getName() : name;
        String updatedEmail = (userBody != null && userBody.getEmail() != null) ? userBody.getEmail() : email;

        if (updatedName != null && !updatedName.trim().isEmpty()) {
            existingUser.setName(updatedName.trim());
        }
        if (updatedEmail != null && !updatedEmail.trim().isEmpty()) {
            existingUser.setEmail(updatedEmail.trim());
        }

        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping(path={"/{id}", "/delete/{id}"})
    public @ResponseBody ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
