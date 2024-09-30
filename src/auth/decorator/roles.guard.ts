import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

export interface JwtPayload {
    username: string;
    role: Role;
    id: ObjectId;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('Required Roles:', requiredRoles); // Log required roles

        if (!requiredRoles) {
            console.log('No roles defined, access granted to everyone.'); // Log if no roles are defined
            return true; // If no roles are defined, anyone can access
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']; // Adjusted to extract token from custom header

        if (!token) {
            console.log('No token found, access denied.'); // Log if no token is present
            return false;
        }

        let user: JwtPayload;
        try {
            user = this.jwtService.verify(token, { secret: 'hamada_1234' }); // Validate the token
            console.log('Decoded User:', user); // Log the decoded user information
        } catch (error) {
            console.log('Invalid token, access denied.'); // Log if token is invalid
            return false; // Token is invalid
        }

        const hasRole = requiredRoles.includes(user.role);
        console.log('User Role:', user.role, 'Access Granted:', hasRole); // Log user role and access decision
        request.user = user; // Attach the decoded user object (including user ID) to the request object

        return requiredRoles.includes(user.role);
        //return hasRole; // Return true if the user has the required role
    }
}
