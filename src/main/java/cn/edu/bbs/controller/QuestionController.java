package cn.edu.bbs.controller;

import cn.edu.bbs.entity.PostEntity;
import cn.edu.bbs.entity.ReplyEntity;
import cn.edu.bbs.service.PostService;
import cn.edu.bbs.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Controller
@RequestMapping(value = "question")
public class QuestionController {

    @Autowired
    private PostService postService;
    @Autowired
    private ReplyService replyService;
    @RequestMapping(method = RequestMethod.GET)
    public String getQuestion(Model model){
        List<PostEntity> postEntities= postService.findPostEntitiesByIspost(Byte.valueOf("1"));
        model.addAttribute("questions",postEntities);
        return "questions";
    }
    @RequestMapping(value = "/{postId}",method = RequestMethod.GET)
    public String GetPostContent(@PathVariable Integer postId, Model model){
        model.addAttribute("post",postService.findPostEntityByPostId(postId,Byte.valueOf("1")));
        model.addAttribute("replyList",replyService.findReplyEntitiesByPostId(postId));
        model.addAttribute("reply",new ReplyEntity());
        return "questionContent";
    }
}

public class QuestionController {

    @Autowired
    private PostService postService;
    @Autowired
    private ReplyService replyService;
    @RequestMapping(method = RequestMethod.GET)
    public String getQuestion(Model model){
        List<PostEntity> postEntities= postService.findPostEntitiesByIspost(Byte.valueOf("1"));
        model.addAttribute("questions",postEntities);
        return "questions";
    }
    @RequestMapping(value = "/{postId}",method = RequestMethod.GET)
    public String GetPostContent(@PathVariable Integer postId, Model model){
        model.addAttribute("post",postService.findPostEntityByPostId(postId,Byte.valueOf("1")));
        model.addAttribute("replyList",replyService.findReplyEntitiesByPostId(postId));
        model.addAttribute("reply",new ReplyEntity());
        return "questionContent";
    }
}

