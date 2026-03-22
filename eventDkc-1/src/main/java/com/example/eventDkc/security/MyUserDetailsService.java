package com.example.eventDkc.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.eventDkc.entities.User;
import com.example.eventDkc.services.UserService;

@Service
public class MyUserDetailsService implements UserDetailsService{
    @Autowired
    UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub

            User user = userService.findUserByUsername(username);
            if (user == null)
                throw new UsernameNotFoundException("Username introuvable");
            List<GrantedAuthority> auths = new ArrayList<>();
            String nomRole = (user.getRole() != null && user.getRole().getNomRole() != null)
                    ? user.getRole().getNomRole().trim()
                    : "USER";
            // Spring Security + JWT : autorités au format ROLE_USER, ROLE_ADMIN
            String authority = nomRole.startsWith("ROLE_") ? nomRole : "ROLE_" + nomRole;
            auths.add(new SimpleGrantedAuthority(authority));



        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), auths);
    }



}
